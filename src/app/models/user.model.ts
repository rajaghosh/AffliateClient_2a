export interface UserRegistrationModel {
    Name: string;
    Email: string;
    Password: string;
}

export interface UserDetailsDTO {
    name: string;
    email: string;
    id: number;
    isActive : boolean;
}