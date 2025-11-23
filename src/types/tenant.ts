export type TenantType = "food_truck" | "booth" | "space_only";

export type Tenant = {
    id: string;
    tenant_name: string;
    tenant_type: TenantType;
    tenant_phone?: string | null;
    tenant_address?: string | null;
    booth_num?: string | null;
    area_sm?: number | null;
    created_at?: string;
};
