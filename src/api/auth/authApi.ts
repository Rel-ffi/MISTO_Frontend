import type {
    AddNewsTypeRequest,
    Establishment,
    EstablishmentDetails,
    EstablishmentFilters,
    LoginRequest,
    LoginResponse,
    NewsEstablishment,
    NewsType,
    OtpVerifyRequest,
    OtpVerifyResponse,
    Page,
    Pageable,
    RegisterRequest,
    Review,
    TagsEstablishment,
    UserResponse
} from "./types.ts";
import {api, apiAuth} from "../axiosInstance.ts";

export const authApi = {
    register(data: RegisterRequest) {
        return api.post<string>('/auth/public/register', data);
    },
    login(data: LoginRequest){
        return api.post<LoginResponse>('/auth/public/login', data);
    },

    verifyOtp(data: OtpVerifyRequest) {
        return api.post<OtpVerifyResponse>(
            "/auth/public/otp/verify",
            data
        );
    },

    resendOtp: (email: string) =>
        api.post("/auth/public/otp/otpCodeResend", null, {
            params: { email },
        }),

    getUserFromToken: () => {
        return apiAuth().get<UserResponse>("/auth/user");
    },

    updateUser(formData: FormData) {
        return apiAuth()
            .put("/auth/user", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
    },

    createEstablishment(formData: FormData) {
        return apiAuth()
            .post("/auth/establishment", formData,{headers: {"Content-Type": "multipart/form-data"}});
    },

    async getEstablishmentByUser() {
        const res = await apiAuth()
            .get<Establishment[]>("/auth/establishment/owner");
        return res.data;
    },

    async getEstablishmentById(id: number) {
        const res = await apiAuth()
            .get<EstablishmentDetails>("/auth/establishment/" + id);

        return res.data;
    },

    async getEstablishmentNotApprovedAdmin(pageable: Pageable) {
        const res = await apiAuth()
            .get<Page<Establishment>>("/auth/admin/establishment", {
                params: pageable
            });

        return res.data;
    },

    async getTotalViewsAdmin() {
        const res = await apiAuth()
            .get<number>("/auth/admin/users/value")

        return res.data;
    },

    async getTotalNotApprovedEstablishmentsAdmin() {
        const res = await apiAuth()
            .get<number>("/auth/admin/establishment/value")

        return res.data;
    },
    async addViewToEstablishment(id:number) {
        await apiAuth().post(`/public/establishment/${id}`)
    },

    async approveEstablishmentAdmin(id: number) {
        return await apiAuth()
            .post(`/auth/admin/establishment/${id}`);
    },

    async deleteEstablishmentAdmin(id: number) {
        return await apiAuth()
            .delete(`/auth/establishment/${id}`);
    },

    async getAllTags() {
        const res = await apiAuth()
            .get<TagsEstablishment[]>("/auth/establishment/tag")

        return res.data;
    },

    async addNewTag(name: string) {
        const formData = new FormData();
        formData.append("name", name);

        return await apiAuth()
            .post("/auth/admin/establishment/tag", formData, {headers: {"Content-Type": "multipart/form-data"}});
    },

    async deleteTagAdmin(id: number) {
        await apiAuth()
            .delete(`/auth/admin/establishment/tag/${id}`)
    },

    addNewsToEstablishmentOwner(data: FormData) {
        return apiAuth()
            .post("/auth/news", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
    },

    async getAllNewsType() {
        const res = await apiAuth()
            .get<NewsType[]>("/public/newsType");

        return res.data;
    },

    async addNewsTypeAdmin(data: AddNewsTypeRequest) {
        await apiAuth()
            .post<AddNewsTypeRequest>("/auth/admin/newsType", data)
    },

    async deleteNewsTypeAdmin(id: number) {
        await apiAuth()
            .delete(`/auth/admin/newsType/${id}`)
    },

    async getAllNews(page: number = 0, size: number = 2) {
        const res = await apiAuth().get<Page<NewsEstablishment>>("/auth/news", {
            params: { page, size }
        });
        return res.data;
    },

    async getNewsByNewsType(newsTypeId: number, page: number = 0, size: number = 2) {
        const res = await apiAuth().get<Page<NewsEstablishment>>(`/auth/news/type/${newsTypeId}`, {
            params: { page, size }
        });
        return res.data;
    },

    async getReviewsByUserId(userId:number) {
        const res = await apiAuth()
            .get<Review[]>(`/auth/review/${userId}`)

        return res.data;
    },

    async deleteUserReviewById(reviewId:number) {
        await apiAuth()
            .delete(`/auth/establishment/review/${reviewId}`)
    },


    async getEstablishments(filters: EstablishmentFilters) {
        const res = await apiAuth()
            .get<Page<Establishment>>("/auth/establishment", {
                params: {
                    ...filters,
                    tagIds: filters.tagIds?.join(","),
                }
            });

        return res.data;
    },

    async addToFavoriteUser(id:number) {
        const res = await apiAuth().post(`/auth/favorite/establishment/${id}`);

        console.log(res);
    },

    async deleteFromFavoriteUser(id: number) {
        return apiAuth().delete<void>(`/auth/favorite/establishment/${id}`);
    },


    addReview(
        establishmentId: bigint,
        rating?: number,
        text?: string,
        complaint?: boolean,
        checkAmount?: number
    ) {
        return apiAuth().post(
            `/auth/establishment/review/${establishmentId}`,
            null,
            {
                params: {
                    rating,
                    text,
                    complaint,
                    checkAmount
                }
            }
        );
    }
}