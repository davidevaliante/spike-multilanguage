export class AwsVideoApproved {

    constructor(
        public approved: boolean,
        public auxiliaryBonuses: string[],
        public description: string,
        public highLights: HighLight[],
        public jobId: string,
        public lastModified: number,
        public lastUpdate: number,
        public mainBonus: number,
        public rawDescription: string,
        public relatedSlots: string[],
        public relatedVideos: string[],
        public slotType: "GRATIS" | "BAR" | "VLT",
        public status: string,
        public time: number,
        public title: string,
        public videoId: string,
        public visibility: 'PUBLIC' | 'HIDDEN' | 'SCHEDULED'
    ) {}
}

export class HighLight {
    constructor(
        public minute: string,
        public second: string
    ) {}
}