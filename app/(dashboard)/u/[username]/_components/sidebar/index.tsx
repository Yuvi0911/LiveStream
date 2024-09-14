// is file ki help se hum dashboard page pr sidebar dikhaye ge.

import { Navigation } from "./navigation"
import { Toggle } from "./toggle"
import { Wrapper } from "./wrapper"

export const Sidebar = () => {
    return (
        <Wrapper>
            <Toggle />
            <Navigation />
        </Wrapper>
    )
}