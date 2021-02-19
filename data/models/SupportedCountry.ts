export class SupportedCountry {
    constructor(
        public id: number,
        public created_at: Date,
        public updated_at: Date,
        public code: string,
        public name: string,
        public englishName: string,
        public bonuses: number[],
        public producers: number[],
        public slots: number[],
    ) {}
}