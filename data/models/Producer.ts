export class Producer {
    constructor(
        public id: string | undefined,
        public legacyId: string,
        public legacySlug: string,
        public description: string,
        public image: string,
        public link: string,
        public name: string,
        public time: string,
        public status: 'public' | 'hidden'
    ) {}
}