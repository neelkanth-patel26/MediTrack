import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const doctorId = searchParams.get('doctorId')

    if (!doctorId) {
      return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 })
    }

    // Get doctor's internal ID
    const { data: doctorData, error: doctorError } = await supabase
      .from('doctors')
      .select('id')
      .eq('user_id', doctorId)
      .single()

    if (doctorError) throw doctorError

    const { data: diagnoses, error } = await supabase
      .from('ai_diagnoses')
      .select(`
        *,
        patients!inner(
          patient_id,
          users!inner(name)
        )
      `)
      .eq('doctor_id', doctorData.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    const formattedDiagnoses = diagnoses?.map(diagnosis => ({
      id: diagnosis.id,
      patientName: diagnosis.patients.users.name,
      patientId: diagnosis.patients.patient_id,
      symptoms: diagnosis.symptoms,
      aiSuggestion: diagnosis.ai_suggestion,
      finalDiagnosis: diagnosis.final_diagnosis,
      treatmentPlan: diagnosis.treatment_plan,
      confidenceScore: diagnosis.confidence_score,
      status: diagnosis.status,
      createdAt: diagnosis.created_at
    })) || []

    return NextResponse.json({ diagnoses: formattedDiagnoses })

  } catch (error) {
    console.error('Error fetching AI diagnoses:', error)
    return NextResponse.json({ error: 'Failed to fetch diagnoses' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { doctorId, patientId, symptoms, patientAge, patientGender, medicalHistory } = body

    if (!doctorId || !patientId || !symptoms) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get doctor's internal ID
    const { data: doctorData, error: doctorError } = await supabase
      .from('doctors')
      .select('id')
      .eq('user_id', doctorId)
      .single()

    if (doctorError) throw doctorError

    // Call Gemini AI for real analysis
    try {
      const aiResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/gemini`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms, patientAge, patientGender, medicalHistory })
      })

      if (aiResponse.ok) {
        const aiResult = await aiResponse.json()
        
        if (aiResult.success) {
          const analysis = aiResult.analysis
          const aiSuggestion = `Primary Diagnosis: ${analysis.primaryDiagnosis}\n\nDifferential Diagnoses: ${analysis.differentialDiagnoses.join(', ')}\n\nRecommended Tests: ${analysis.recommendedTests.join(', ')}\n\nTreatment: ${analysis.treatmentRecommendations.join(', ')}\n\nUrgency: ${analysis.urgencyLevel}\n\nReasoning: ${analysis.reasoning}`

          // Save to database
          const { data, error: insertError } = await supabase
            .from('ai_diagnoses')
            .insert({
              doctor_id: doctorData.id,
              patient_id: patientId,
              symptoms,
              ai_suggestion: aiSuggestion,
              confidence_score: analysis.confidenceScore,
              status: 'pending',
              created_at: new Date().toISOString()
            })
            .select()
            .single()

          if (insertError) throw insertError

          return NextResponse.json({ 
            aiSuggestion,
            confidence: analysis.confidenceScore,
            diagnosisId: data.id,
            analysis
          })
        }
      }
    } catch (aiError) {
      console.error('Gemini AI failed, using fallback:', aiError)
    }

    // Fallback to simple analysis if Gemini fails
    const lowerSymptoms = symptoms.toLowerCase()
    let aiSuggestion = ''
    let confidence = 0
    let analysis = {
      primaryDiagnosis: '',
      differentialDiagnoses: [],
      recommendedTests: ['Clinical examination', 'Basic diagnostic tests'],
      treatmentRecommendations: ['Consult healthcare provider'],
      urgencyLevel: 'Medium',
      confidenceScore: 70,
      reasoning: 'Fallback analysis - please consult with healthcare professional'
    }

    if (lowerSymptoms.includes('chest pain') || lowerSymptoms.includes('shortness of breath')) {
      analysis.primaryDiagnosis = 'Potential Cardiac Issue'
      analysis.differentialDiagnoses = ['Angina', 'Myocardial infarction', 'Pulmonary embolism']
      analysis.recommendedTests = ['ECG', 'Troponin levels', 'Chest X-ray']
      analysis.treatmentRecommendations = ['Immediate cardiology referral', 'Monitor vital signs']
      analysis.urgencyLevel = 'High'
      analysis.confidenceScore = 87
      confidence = 87
    } else if (lowerSymptoms.includes('fever') && lowerSymptoms.includes('cough')) {
      analysis.primaryDiagnosis = 'Upper Respiratory Infection'
      analysis.differentialDiagnoses = ['Viral infection', 'Bacterial pneumonia', 'Bronchitis']
      analysis.recommendedTests = ['Chest X-ray', 'Complete blood count', 'Sputum culture']
      analysis.treatmentRecommendations = ['Rest', 'Fluids', 'Symptomatic treatment']
      analysis.urgencyLevel = 'Medium'
      analysis.confidenceScore = 92
      confidence = 92
    } else {
      analysis.primaryDiagnosis = 'Clinical assessment required'
      analysis.differentialDiagnoses = ['Multiple conditions possible']
      analysis.confidenceScore = 65
      confidence = 65
    }

    aiSuggestion = `Primary Diagnosis: ${analysis.primaryDiagnosis}\n\nDifferential Diagnoses: ${analysis.differentialDiagnoses.join(', ')}\n\nRecommended Tests: ${analysis.recommendedTests.join(', ')}\n\nTreatment: ${analysis.treatmentRecommendations.join(', ')}\n\nUrgency: ${analysis.urgencyLevel}\n\nReasoning: ${analysis.reasoning}`

    // Save to database
    const { data, error: insertError } = await supabase
      .from('ai_diagnoses')
      .insert({
        doctor_id: doctorData.id,
        patient_id: patientId,
        symptoms,
        ai_suggestion: aiSuggestion,
        confidence_score: analysis.confidenceScore,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (insertError) throw insertError

    return NextResponse.json({ 
      aiSuggestion,
      confidence: analysis.confidenceScore,
      diagnosisId: data.id,
      analysis
    })

  } catch (error) {
    console.error('Error creating AI diagnosis:', error)
    return NextResponse.json({ error: 'Failed to analyze symptoms' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const diagnosisId = searchParams.get('diagnosisId')
    const body = await request.json()
    const { status, doctorNotes, finalDiagnosis, treatmentPlan, patientId, symptoms, aiSuggestion, confidence } = body

    let updateData: any = {
      updated_at: new Date().toISOString()
    }

    // If updating existing diagnosis
    if (diagnosisId) {
      updateData = {
        ...updateData,
        status,
        doctor_notes: doctorNotes,
        final_diagnosis: finalDiagnosis,
        treatment_plan: treatmentPlan
      }

      const { data, error } = await supabase
        .from('ai_diagnoses')
        .update(updateData)
        .eq('id', diagnosisId)
        .select()

      if (error) throw error

      return NextResponse.json({ 
        message: 'AI diagnosis updated successfully',
        diagnosis: data[0]
      })
    }
    
    // If confirming new diagnosis
    if (patientId && symptoms && aiSuggestion) {
      const { data, error } = await supabase
        .from('ai_diagnoses')
        .insert({
          patient_id: patientId,
          symptoms,
          ai_suggestion: aiSuggestion,
          confidence_score: confidence,
          final_diagnosis: finalDiagnosis,
          treatment_plan: treatmentPlan,
          status: 'confirmed',
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      return NextResponse.json({ 
        message: 'Diagnosis confirmed and saved',
        diagnosis: data
      })
    }

    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })

  } catch (error) {
    console.error('Error updating AI diagnosis:', error)
    return NextResponse.json({ error: 'Failed to update diagnosis' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const diagnosisId = searchParams.get('diagnosisId')
    const doctorId = searchParams.get('doctorId')

    if (!diagnosisId || !doctorId) {
      return NextResponse.json({ error: 'Diagnosis ID and Doctor ID are required' }, { status: 400 })
    }

    // Get doctor's internal ID
    const { data: doctorData, error: doctorError } = await supabase
      .from('doctors')
      .select('id')
      .eq('user_id', doctorId)
      .single()

    if (doctorError) throw doctorError

    // Verify the diagnosis belongs to this doctor before deleting
    const { data: diagnosis, error: verifyError } = await supabase
      .from('ai_diagnoses')
      .select('id, doctor_id')
      .eq('id', diagnosisId)
      .single()

    if (verifyError) throw verifyError

    if (diagnosis.doctor_id !== doctorData.id) {
      return NextResponse.json({ error: 'Unauthorized to delete this diagnosis' }, { status: 403 })
    }

    // Delete the diagnosis
    const { error: deleteError } = await supabase
      .from('ai_diagnoses')
      .delete()
      .eq('id', diagnosisId)

    if (deleteError) throw deleteError

    return NextResponse.json({ message: 'AI diagnosis deleted successfully' })

  } catch (error) {
    console.error('Error deleting AI diagnosis:', error)
    return NextResponse.json({ error: 'Failed to delete diagnosis' }, { status: 500 })
  }
}