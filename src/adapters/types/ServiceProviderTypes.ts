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
    }
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
  };
};
