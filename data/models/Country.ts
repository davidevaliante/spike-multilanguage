export default class Country {
    constructor(
        public id: number,
        public code: string,
        public name: string,
        public englishName: string,
        public status: 'visible' | 'hidden'
    ) {}
}