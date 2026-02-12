export interface RegisterRequest {
    email: string;
    fullName: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    requiresOtp: boolean;
    accessToken: string;
    refreshToken: string;
}

export interface OtpVerifyRequest {
    email?:string
    code:string;
}

export interface OtpVerifyResponse {
    accessToken: string;
    refreshToken:string;
}

export interface UserResponse {
    id: number;
    email: string;
    fullName: string;
    avatarUrl: string;
    isAdmin: boolean;
    favoriteEstablishments: Establishment[];
}

export interface Pageable {
    page?:number,
    size?:number,
    sort?:string
}

export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}


export interface Establishment {
    id: number;
    name: string;
    address: string;
    rating: number | string;
    averageCheck: number;
    photoUrls: [string];
    approved: boolean;
    tags:TagsEstablishment[];
}

export interface EstablishmentDetails {
    id:number;
    name:string;
    address: string;
    phone: string;
    email: string;
    description: string;
    averageCheck: number;
    workingHours: string;
    latitude: number;
    longitude: number;
    photoUrls:string[]
    rating:number;
    views:number;
    owner:OwnerEstablishment;
    tags:TagsEstablishment[];
    reviews:Review[]
    approved: boolean;
}

export interface OwnerEstablishment {
    id:number;
    username:string;
    photoUrl:string;
    email:string;
}
export interface TagsEstablishment {
    id:number;
    name:string;
}

export interface CreateNewsRequest {
    establishmentId: number;
    title: string;
    content: string;
    typeId: number;
    paid: boolean;
}


export interface NewsEstablishment {
    id:number;
    title:string;
    content:string;
    type:NewsType;
    createdAt:string;
    photoUrls:string[];
    paid:boolean;
    establishmentId:number;
}

export interface NewsType {
    id:number;
    name:string;
    description:string;
}

export interface AddNewsTypeRequest {
    name:string;
    description:string;
}

export interface EstablishmentFilters {
    page: number;
    size: number;
    minRating?: number;
    minAverageCheck?: number;
    searchQuery?: string;
    tagIds?: number[];
}

export interface Review {
    id:number,
    rating:number,
    text:string,
    checkAmount:number,
    complaint:boolean,
    createdAt:string,
    author:UserResponse,
    establishmentId:number
}


