import Admin from "../models/admin.model";
import {AdminInterface} from "../types";

export const getAdminByEmail = async (email: AdminInterface["email"]) => {
    try {
        return Admin.findOne({email});
    } catch (e) {
        console.log("Error while fetching user", e);
        throw e;
    }
}

export const getAdminById = async (adminId: AdminInterface["_id"]) => {
    try {
        return Admin.findById(adminId);
    } catch (e) {
        console.log("Error while fetching user", e);
        throw e;
    }
}