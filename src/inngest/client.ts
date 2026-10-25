import { Inngest, EventSchemas } from "inngest";

export type MildraftEvents = {
  "draft/draft.start": {
    data: {
      draftStart: string;
      draftId: number;
      leagueName: string;
    };
  };
  "draft/draftStart.changed": {
    data: {
      draftId: number;
    };
  };
  "draft/turn.started": {
    data: {
      pickId: number;
      draftId: number;
    };
  };
  "draft/pick.submitted": {
    data: {
      pickId: number;
    };
  };
};

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "mildraft",
  schemas: new EventSchemas().fromRecord<MildraftEvents>(),
});
