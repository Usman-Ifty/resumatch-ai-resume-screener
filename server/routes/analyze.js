const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Groq = require('groq-sdk');
const Analysis = require('../models/Analysis');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Store uploaded file in memory — no disk writes needed
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/analyze
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No resume PDF uploaded.' });
    }
    if (!jobDescription || jobDescription.trim().length < 20) {
      return res.status(400).json({ error: 'Job description is too short.' });
    }

    // Step 1: Extract text from PDF buffer
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text.trim();

    if (!resumeText || resumeText.length < 50) {
      return res.status(400).json({
        error: 'Could not extract text from PDF. Make sure it is not a scanned image.',
      });
    }

    // Step 2: Build prompt
    const prompt =
      'You are an expert ATS (Applicant Tracking System) and technical recruiter.\n\n' +
      'Analyze the following resume against the job description and return a JSON response ONLY.\n' +
      'Do not include any explanation or text outside the JSON block.\n\n' +
      'Resume:\n' + resumeText.substring(0, 4000) + '\n\n' +
      'Job Description:\n' + jobDescription.substring(0, 2000) + '\n\n' +
      'Return ONLY this JSON structure — no extra text, no markdown:\n' +
      '{\n' +
      '  "score": <integer 0-100>,\n' +
      '  "verdict": "<one of: Strong Match | Good Match | Partial Match | Weak Match>",\n' +
      '  "matched_skills": ["skill1", "skill2"],\n' +
      '  "missing_skills": ["skill1", "skill2"],\n' +
      '  "reasoning": "<2-3 sentence explanation of the score>"\n' +
      '}';

    // Step 3: Call Groq API
    const completion = await groq.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 800,
    });

    const rawResponse = completion.choices[0]?.message?.content || '';

    // Step 4: Parse JSON from response
    let parsed;
    try {
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in response');
      parsed = JSON.parse(jsonMatch[0]);
    } catch (parseErr) {
      console.error('Groq parse error:', rawResponse);
      return res.status(500).json({ error: 'AI returned an unexpected format. Please try again.' });
    }

    // Step 5: Save to MongoDB
    const analysis = new Analysis({
      resumeText: resumeText.substring(0, 3000),
      jobDescription: jobDescription.substring(0, 2000),
      score: parsed.score,
      verdict: parsed.verdict,
      matchedSkills: parsed.matched_skills || [],
      missingSkills: parsed.missing_skills || [],
      reasoning: parsed.reasoning || '',
    });
    await analysis.save();

    // Step 6: Return result to frontend
    res.json({
      score: parsed.score,
      verdict: parsed.verdict,
      matchedSkills: parsed.matched_skills || [],
      missingSkills: parsed.missing_skills || [],
      reasoning: parsed.reasoning || '',
      analysisId: analysis._id,
    });

  } catch (err) {
    console.error('Analyze error:', err.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;
