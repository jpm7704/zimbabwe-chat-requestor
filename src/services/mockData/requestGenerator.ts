
import { Request } from "../../types";
import { generateMockDocument } from "./documentGenerator";
import { generateMockNote } from "./noteGenerator";
import { generateTimelineEvent } from "./timelineGenerator";

export const generateMockRequests = (count: number = 5): Request[] => {
  const statuses: Array<any> = ["submitted", "assigned", "under_review", "manager_review", "forwarded", "completed", "rejected"];
  const types: Array<any> = ["medical_assistance", "educational_support", "financial_aid", "food_assistance", "shelter_assistance", "water_sanitation", "psychosocial_support", "disaster_relief", "other_assistance"];
  
  return Array.from({ length: count }).map((_, index) => {
    const id = Math.random().toString(36).substring(2, 10);
    const ticketNumber = `BGF-${Math.floor(100000 + Math.random() * 900000)}`;
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString();
    const updatedAt = new Date(Date.now() - Math.floor(Math.random() * 1000000)).toISOString();

    const documents = Array.from({ length: 2 + Math.floor(Math.random() * 3) }).map(() => {
      const docTypes = ["id_document", "medical_records", "prescription", "medical_referral", "educational_records", "school_fee_structure", "admission_letter", "financial_statements", "bank_statements", "proof_of_income", "vulnerability_assessment", "proof_of_residence", "property_documents", "disaster_assessment", "referral_letter", "medical_records", "supporting_letter", "other"];
      return generateMockDocument(id, docTypes[Math.floor(Math.random() * docTypes.length)]);
    });

    const notes = Array.from({ length: Math.floor(Math.random() * 3) }).map(() => generateMockNote(id));

    const timelineEvents = [
      generateTimelineEvent(id, "status_change", createdAt),
      ...Array.from({ length: Math.floor(Math.random() * 3) }).map(() => 
        generateTimelineEvent(
          id, 
          ["status_change", "note_added", "document_added", "assigned"][Math.floor(Math.random() * 4)],
          new Date(Date.now() - Math.floor(Math.random() * 1000000)).toISOString()
        )
      )
    ];

    return {
      id,
      ticketNumber,
      userId: Math.random().toString(36).substring(2, 10),
      type,
      title: `${type.replace('_', ' ')} request for ${['Small Business', 'Startup', 'Expanding Business', 'Tech Company'][Math.floor(Math.random() * 4)]}`,
      description: `This is a request for ${type.replace('_', ' ')} for a business based in ${['Harare', 'Bulawayo', 'Mutare', 'Gweru', 'Masvingo'][Math.floor(Math.random() * 5)]}, Zimbabwe.`,
      status,
      createdAt,
      updatedAt,
      assignedTo: status !== "submitted" ? Math.random().toString(36).substring(2, 10) : undefined,
      documents,
      notes,
      timeline: timelineEvents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    };
  });
};

export const getMockRequest = (requestId: string): Request | undefined => {
  const requests = generateMockRequests(10);
  return requests.find(r => r.id === requestId) || requests[0];
};
