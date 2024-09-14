// humne dashboard page k liye naya sidebar bnaya h toh uske collapse aur show ki state ko manage krne k liye ye function h.

import { create } from "zustand";

export enum ChatVariant {
    CHAT = "CHAT",
    COMMUNITY = "COMMUNITY"
}

interface ChatSidebarStore {
    collapsed: boolean;
    variant: ChatVariant
    onExpand: () => void;
    onCollapse: () => void;
    onChangeVariant: (variant: ChatVariant) => void;
};

export const useChatSidebar = create<ChatSidebarStore>((set) => ({
    collapsed: false,
    variant: ChatVariant.CHAT,
    onExpand: () => set(() => ({collapsed: false})),
    onCollapse: () => set(() => ({collapsed: true})),
    onChangeVariant: (variant: ChatVariant) => set(() => ({ variant })),
}));