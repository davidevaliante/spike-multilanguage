export class Bonus {
    constructor(
        public id: string | undefined,
        public legacyId: string,
        public legacySlug: string,
        public bonus: string,
        public bonusImageBg: string,
        public borderColor: string,
        public bonusCompareLink: string,
        public guideId: string,
        public link: string,
        public name: string,
        public noDepositText: string,
        public rating: string,
        public time: number,
        public tips: string,
        public withDepositText: string,
        public status: 'public' | 'hidden'
    ) { }
}

export class ApolloBonusCardReveal {
    constructor(
        public id: string | undefined | number,
        public name: string,
        public circular_image: { url: string },
        public borderColor: string,
        public backgroundColor: string,
        public noDeposit: string,
        public withDeposit: string,
        public rating: number,
        public tips: string,
        public link: string,
        public bonus_guide: {
            slug: string
        },
        public description?: string,

    ) { }
}

