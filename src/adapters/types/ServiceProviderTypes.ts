export type SearchServiceProvider = {
  data: [
    {
      created_at: string;
      updated_at: string;
      languages: string[];
      specialty: string;
      rating: number;
      price: string | number | null;
      practice_start_date: string | null;
      verified: boolean | null;
      status: string | null;
      email: string;
      service_type: string | null;
      working_hours: string | null;
      first_name: string;
      last_name: string;
      id: string;
      bio: string | null;
    },
  ];
};

export type ServiceProviderDetails = {
  data: {
    created_at: string;
    updated_at: string;
    languages: string[];
    specialty: string;
    rating: number;
    price: string | number | null;
    practice_start_date: string | null;
    verified: boolean | null;
    status: string | null;
    email: string;
    service_type: string | null;
    working_hours: string | null;
    first_name: string;
    last_name: string;
    id: string;
    bio: string | null;
    medical_license_file: string;
    medical_license_no: string;
    identification_file: string;
    identification_no: string | null;
    identification_type: string;
    university_degree_file: string;
    years_of_experience: string;
    issuing_medical_board: string;
    professional_associations: string;
    profile_image: string | null;
    dob: string;
    gender: string;
  };
};
