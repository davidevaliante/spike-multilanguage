import { Bonus } from "./Bonus"
import { Producer } from "./Producer"
import { SupportedCountry } from "./SupportedCountry"
import { SLOT_TYPE } from "../../graphql/schema"

export class SlotCard {
    constructor(
        public id: string | undefined,
        public description: string,
        public name: string,
        public producer: string,
        public rating: string,
        public specialBonusLink: string,
        public time: number,
        public type: 'GRATIS' | 'BAR' | 'VLT'
    ) {}
}

export class ApolloSlotCard {
    constructor(
        public id: string | undefined,
        public image: { url: string },
        public name: string,
        public rating: number,
        public slug: string,
        public type: SLOT_TYPE,
        public bonuses: Bonus[]
    ) {}
}

export class OldSlot {
    constructor(
        public id: string | undefined,
        public legacyId: string | undefined,
        public bonus: Bonus[],
        public bonusSpecial: Bonus,
        public description: string,
        public isPopular: boolean,
        public linkPlay: string,
        public linkYoutube: string,
        public linkYoutubeDescription: string,
        public name: string,
        public onlineVersion: SlotCard,
        public producer: Producer,
        public rating: string,
        public similarSlots: any,
        public specialBonusLink: string,
        public tecnicals: string,
        public time: number,
        public tips: string,
        public type: 'GRATIS' | 'BAR' | 'VLT'
    ) {}
}

export class Slot {
    constructor(
        public id: string | undefined,
        public legacyId: string,
        public legacySlug: string,
        public description: string,
        public isPopularInCountry: boolean,
        public playLink: string,
        public linkYoutube: string,
        public videoDescription: string,
        public name: string,
        public rating: number,
        public tips: string,
        public country: SupportedCountry,
        public technicals: string,
        public slug: string,
        public producer: Producer,
        public relatedSlots: number[],
        public status: 'published' | 'draft' | 'archive'
    ) {}
}