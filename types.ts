export type TaskType = {
    id: string;
    title: string;
    body: string;
    times: { startTime: Date; endTime: Date }[];
    state: "completed" | "in-progress" | "new";
  };
  
export type GoogleUserObj = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean
}

export type GoogleCalendarListing =  {
  "kind": string,
  "etag": number,
  "id": string,
  "summary": string,
  "description": string ,
  "timeZone": string,
  "summaryOverride": string,
  "colorId": number,
  "backgroundColor": string,
  "foregroundColor": string,
  "accessRole": string,
  "defaultReminders": [],
  "conferenceProperties": any
}

export type GoogleCalendarEventListing = {
  "kind": string,
  "etag": string,
  "summary": string,
  "description": string,
  "updated": Date,
  "timeZone": string,
  "accessRole": string,
  "defaultReminders": [
    {
      "method": string,
      "minutes": number
    }
  ],
  "nextPageToken": string,
  "nextSyncToken": string,
  "items": googleCalendarEvent[]
}

export type googleCalendarEvent = {
  "kind": string,
  "etag": string,
  "id": string,
  "status": string,
  "htmlLink": string,
  "created": Date,
  "updated": Date,
  "summary": string,
  "description": string,
  "location": string,
  "colorId": string,
  "creator": {
    "id": string,
    "email": string,
    "displayName": string,
    "self": boolean
  },
  "organizer": {
    "id": string,
    "email": string,
    "displayName": string,
    "self": boolean
  },
  "start": {
    "date": Date,
    "dateTime": Date,
    "timeZone": string
  },
  "end": {
    "date": Date,
    "dateTime": Date,
    "timeZone": string
  },
  "endTimeUnspecified": boolean,
  "recurrence": [
    string
  ],
  "recurringEventId": string,
  "originalStartTime": {
    "date": Date,
    "dateTime": Date,
    "timeZone": string
  },
  "transparency": string,
  "visibility": string,
  "iCalUID": string,
  "sequence": number,
  "attendees": [
    {
      "id": string,
      "email": string,
      "displayName": string,
      "organizer": boolean,
      "self": boolean,
      "resource": boolean,
      "optional": boolean,
      "responseStatus": string,
      "comment": string,
      "additionalGuests": number
    }
  ],
  "attendeesOmitted": boolean,
  "extendedProperties": {
    "private": Record<string,string>,
    "shared": Record<string,string>
  },
  "hangoutLink": string,
  "conferenceData": {
    "createRequest": {
      "requestId": string,
      "conferenceSolutionKey": {
        "type": string
      },
      "status": {
        "statusCode": string
      }
    },
    "entryPoints": [
      {
        "entryPointType": string,
        "uri": string,
        "label": string,
        "pin": string,
        "accessCode": string,
        "meetingCode": string,
        "passcode": string,
        "password": string
      }
    ],
    "conferenceSolution": {
      "key": {
        "type": string
      },
      "name": string,
      "iconUri": string
    },
    "conferenceId": string,
    "signature": string,
    "notes": string,
  },
  "gadget": {
    "type": string,
    "title": string,
    "link": string,
    "iconLink": string,
    "width": number,
    "height": number,
    "display": string,
    "preferences": Record<string,string>
  },
  "anyoneCanAddSelf": boolean,
  "guestsCanInviteOthers": boolean,
  "guestsCanModify": boolean,
  "guestsCanSeeOtherGuests": boolean,
  "privateCopy": boolean,
  "locked": boolean,
  "reminders": {
    "useDefault": boolean,
    "overrides": [
      {
        "method": string,
        "minutes": number
      }
    ]
  },
  "source": {
    "url": string,
    "title": string
  },
  "workingLocationProperties": {
    "type": string,
    "homeOffice": string,
    "customLocation": {
      "label": string
    },
    "officeLocation": {
      "buildingId": string,
      "floorId": string,
      "floorSectionId": string,
      "deskId": string,
      "label": string
    }
  },
  "outOfOfficeProperties": {
    "autoDeclineMode": string,
    "declineMessage": string
  },
  "focusTimeProperties": {
    "autoDeclineMode": string,
    "declineMessage": string,
    "chatStatus": string
  },
  "attachments": [
    {
      "fileUrl": string,
      "title": string,
      "mimeType": string,
      "iconLink": string,
      "fileId": string
    }
  ],
  "eventType": string
}