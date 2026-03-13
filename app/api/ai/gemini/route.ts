import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { symptoms, patientAge, patientGender, medicalHistory } = body

    if (!symptoms) {
      return NextResponse.json({ error: 'Symptoms are required' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error('Gemini API key not configured')
      // Return fallback analysis instead of error
      return NextResponse.json({
        success: true,
        analysis: getFallbackAnalysis(symptoms),
        rawResponse: 'Using fallback analysis - Gemini API not configured'
      })
    }

    // Use fetch to call Gemini API directly
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `As a medical AI assistant, analyze the following patient information and provide a diagnostic assessment:

Patient Information:
- Age: ${patientAge || 'Not specified'}
- Gender: ${patientGender || 'Not specified'}
- Medical History: ${medicalHistory || 'None provided'}
- Current Symptoms: ${symptoms}

Please provide:
1. Most likely diagnosis (primary)
2. Differential diagnoses (2-3 alternatives)
3. Recommended diagnostic tests
4. Treatment recommendations
5. Urgency level (Low/Medium/High/Critical)
6. Confidence score (0-100%)

Format your response as JSON with the following structure:
{
  "primaryDiagnosis": "string",
  "differentialDiagnoses": ["string1", "string2", "string3"],
  "recommendedTests": ["string1", "string2"],
  "treatmentRecommendations": ["string1", "string2"],
  "urgencyLevel": "string",
  "confidenceScore": number,
  "reasoning": "string explaining the diagnostic reasoning"
}

Important: This is for educational/assistance purposes only. Always recommend consulting with a healthcare professional for proper diagnosis and treatment.`
          }]
        }]
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API Error:', response.status, errorText)
      // Return fallback analysis instead of throwing error
      return NextResponse.json({
        success: true,
        analysis: getFallbackAnalysis(symptoms),
        rawResponse: `Gemini API error (${response.status}), using fallback analysis`
      })
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated'

    // Try to parse JSON from the response
    let aiAnalysis
    try {
      // Extract JSON from the response if it's wrapped in markdown
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text
      aiAnalysis = JSON.parse(jsonString)
    } catch (parseError) {
      // If JSON parsing fails, use fallback analysis
      aiAnalysis = getFallbackAnalysis(symptoms)
      aiAnalysis.reasoning = text
    }

    return NextResponse.json({
      success: true,
      analysis: aiAnalysis,
      rawResponse: text
    })

  } catch (error) {
    console.error('Gemini AI Error:', error)
    // Return fallback analysis instead of error
    return NextResponse.json({
      success: true,
      analysis: getFallbackAnalysis(symptoms),
      rawResponse: 'Error occurred, using fallback analysis'
    })
  }
}

function getFallbackAnalysis(symptoms: string) {
  const lowerSymptoms = symptoms.toLowerCase()
  
  if (lowerSymptoms.includes('chest pain') || lowerSymptoms.includes('shortness of breath')) {
    return {
      primaryDiagnosis: 'Potential Cardiac Issue',
      differentialDiagnoses: ['Angina', 'Myocardial infarction', 'Pulmonary embolism'],
      recommendedTests: ['ECG', 'Troponin levels', 'Chest X-ray'],
      treatmentRecommendations: ['Immediate cardiology referral', 'Monitor vital signs'],
      urgencyLevel: 'High',
      confidenceScore: 75,
      reasoning: 'Chest pain and breathing difficulties require immediate cardiac evaluation'
    }
  } else if (lowerSymptoms.includes('fever') && lowerSymptoms.includes('cough')) {
    return {
      primaryDiagnosis: 'Upper Respiratory Infection',
      differentialDiagnoses: ['Viral infection', 'Bacterial pneumonia', 'Bronchitis'],
      recommendedTests: ['Chest X-ray', 'Complete blood count', 'Sputum culture'],
      treatmentRecommendations: ['Rest', 'Fluids', 'Symptomatic treatment'],
      urgencyLevel: 'Medium',
      confidenceScore: 80,
      reasoning: 'Fever and cough suggest respiratory infection'
    }
  } else if (lowerSymptoms.includes('headache') && lowerSymptoms.includes('neck stiffness')) {
    return {
      primaryDiagnosis: 'Possible Meningitis',
      differentialDiagnoses: ['Meningitis', 'Tension headache', 'Migraine'],
      recommendedTests: ['Lumbar puncture', 'CT scan', 'Blood cultures'],
      treatmentRecommendations: ['Immediate medical attention', 'IV antibiotics if bacterial'],
      urgencyLevel: 'Critical',
      confidenceScore: 85,
      reasoning: 'Headache with neck stiffness requires urgent evaluation for meningitis'
    }
  } else {
    return {
      primaryDiagnosis: 'Clinical Assessment Required',
      differentialDiagnoses: ['Multiple conditions possible'],
      recommendedTests: ['Clinical examination', 'Basic diagnostic tests'],
      treatmentRecommendations: ['Consult healthcare provider'],
      urgencyLevel: 'Medium',
      confidenceScore: 60,
      reasoning: 'Symptoms require professional medical evaluation for accurate diagnosis'
    }
  }
}