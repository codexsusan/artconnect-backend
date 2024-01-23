import {Model} from "mongoose";

export const clearFieldAfterDelay = async (documentId: string, Document: Model<any>, fieldName: string, delayInSeconds: number) => {
    // Get the document
    const document = await Document.findOne({_id: documentId});
    // If the document exists
    if (document) {
        // Set the timeout
        setTimeout(async () => {
            // Delete the field
            document[fieldName] = "";
            await document.save();
        }, delayInSeconds * 1000);
    }

}