export type SessionNotePayload = {
    note: string,
    patient_id:  string,
    appointment_id: string
}

export type SessionNote = {
    id: string,
    note: string,
    patient_id: string,
    appointment_id: string,
    service_provider_id: string,
    service_provider_name: string,
    created_at: string,
    updated_at: string
}

export type GetSessionNotesResponse ={ 
    data: SessionNote[]
}