import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// jab bhi koi user livestream me message krega toh uska username ka color different hoga dusre user se is function ki help se. We are generating rgb code.
// ye function string se hexcode generate kr dega.
export const stringToColor = (str: string) => {
  let hash = 0;
  for(let i = 0;i < str.length; i++){
    hash = str.charCodeAt(1) + ((hash << 5) - hash);
  }
  let color = "#";
  for(let i = 0; i < 3; i++){
    const value = (hash >> (i * 8)) & 0xFF;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
}