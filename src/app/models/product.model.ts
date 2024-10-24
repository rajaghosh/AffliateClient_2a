export interface ProductDetailsBasic {
    id: number;
    medicineName: string;
    imagePath: string;
    discountPercent: number;
}

export interface ProductDiscountPayload {
    ProductId: number;
    DiscountPercent: number;
}

export interface UserEarning {
    type: string;
    earning: number;
    userEmail: string;
}
