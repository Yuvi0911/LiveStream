// humne dashboard page k liye naya sidebar bnaya h toh uske collapse aur show ki state ko manage krne k liye ye function h.

import { create } from "zustand";

interface CreatorSidebarStore {
    collapsed: boolean;
    onExpand: () => void;
    onCollapse: () => void;
};

export const useCreatorSidebar = create<CreatorSidebarStore>((set) => ({
    collapsed: false,
    onExpand: () => set(() => ({collapsed: false})),
    onCollapse: () => set(() => ({collapsed: true})),
}));