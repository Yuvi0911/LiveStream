import { getRecommended } from "@/lib/recommended-service"
import { Recommended, RecommendedSkeleton } from "./recommended"
import { Toggle, ToggleSkeleton } from "./toggle"
import { Wrapper } from "./wrapper"
import { getFollowedUsers } from "@/lib/follow-service"
import { Following, FollowingSkeleton } from "./following"

// yadi hume check krna h ki konsa component client h aur server h toh hum console log krva kr dekh skte h yadi client component hoga toh console message browser me aaye ga aur yadi server component hoga toh console message terminal me aaye ga.

export const Sidebar = async() => {

    // recommended me db me present users aa jaiye ge jo humne getRecommended file me extract kiye h.
    const recommended = await getRecommended();

    // following me vo sbhi users aa jaiye ge jo ki login user ne follow kr rkhe h.
    const following = await getFollowedUsers();

    return (
        // humne wrapper ko 'use client' ki help se client component bnaya h lekin wrapper k code k ander children method ko use kiya h isliye hum wrapper k ander jo bhi component likhe ge vo apne aap client component nhi bnege, vo server component hi rhe ge. Yadi hum wrapper k ander children wala method use nhi krte toh hum jo bhi wrapper k ander likhte vo client component ban jate.
        <Wrapper>
            <Toggle />
            <div className="space-y-4 pt-4 lg:pt-0">
                <Following data={following} />
                <Recommended data={recommended}/>
            </div>
        </Wrapper>
    )
}

export const SidebarSkeleton = () => {
    return (
        <aside className="fixed left-0 flex flex-col w-[70px] lg:w-60 h-full bg-background border-r border-[#2D2E35] z-50">
            <ToggleSkeleton />
            <FollowingSkeleton />
            <RecommendedSkeleton />
        </aside> 
    )
}