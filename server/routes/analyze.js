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
      'You are a HIGHLY CRITICAL Senior Technical Recruiter and ATS parser.\n\n' +
      'Analyze the following resume against the job description and return a JSON response ONLY.\n' +
      'Be brutally honest. Do not default to 85. Most people are NOT an 85% match.\n\n' +
      'Scoring Methodology (MUST USE):\n' +
      '- Hard Skills Match (40 pts): Do they have the EXACT tech stack?\n' +
      '- Years of Experience (30 pts): Do they meet the seniority requirement?\n' +
      '- Domain/Industry Knowledge (20 pts): Have they worked in this specific sector?\n' +
      '- Soft Skills/Format (10 pts): Is the resume well-structured?\n\n' +
      'Resume:\n' + resumeText.substring(0, 4000) + '\n\n' +
      'Job Description:\n' + jobDescription.substring(0, 2000) + '\n\n' +
      'Return ONLY this JSON structure:\n' +
      '{\n' +
      '  "score": <integer 0-100>,\n' +
      '  "verdict": "<Strong | Good | Partial | Weak Match>",\n' +
      '  "matched_skills": ["skill1", "skill2"],\n' +
      '  "missing_skills": ["skill1", "skill2"],\n' +
      '  "suggestions": ["3 bullets to add"],\n' +
      '  "cover_letter": "<250-word letter>",\n' +
      '  "roadmap": ["Step 1", "Step 2"],\n' +
      '  "ats_score": <integer 0-100>,\n' +
      '  "ats_feedback": "<1-2 sentences on formatting/readability/keywords>",\n' +
      '  "reasoning": "<1-2 sentence breakdown of the score based on the rubric>"\n' +
      '}';

    // Step 3: Call Groq API
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
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
      console.log('AI Response Parsed:', parsed);
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
      suggestions: parsed.suggestions || [],
      coverLetter: parsed.cover_letter || '',
      roadmap: parsed.roadmap || [],
      atsScore: parsed.ats_score || 0,
      atsFeedback: parsed.ats_feedback || '',
      reasoning: parsed.reasoning || '',
    });
    await analysis.save();

    // Step 6: Return result to frontend
    res.json({
      score: parsed.score,
      verdict: parsed.verdict,
      matchedSkills: parsed.matched_skills || [],
      missingSkills: parsed.missing_skills || [],
      suggestions: parsed.suggestions || [],
      coverLetter: parsed.cover_letter || '',
      roadmap: parsed.roadmap || [],
      atsScore: parsed.ats_score || 0,
      atsFeedback: parsed.ats_feedback || '',
      reasoning: parsed.reasoning || '',
      resumeText: resumeText,
      jobDescription: jobDescription,
      analysisId: analysis._id,
    });

  } catch (err) {
    console.error('Analyze error type:', err?.constructor?.name);
    console.error('Analyze error message:', err?.message);
    console.error('Analyze error status:', err?.status);
    console.error('Analyze error full:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// GET /api/analyze/history
router.get('/history', async (req, res) => {
  try {
    const history = await Analysis.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// DELETE /api/analyze/history/:id
router.delete('/history/:id', async (req, res) => {
  try {
    await Analysis.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

module.exports = router;
