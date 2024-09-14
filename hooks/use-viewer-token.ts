// is hook ki help se hum jo user humari stream dekh rha h uski identity k liye use krege.

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { createViewerToken } from "@/actions/token";

// is function ki help se hum us user ki information le ge jo humari stream dekh rha h.
// hostIdentity us user ki identity h jo ki stream kr rha h.
export const useViewerToken = (hostIdentity: string) => {
    const [token, setToken] = useState("");
    const [name, setName] = useState("");
    const [identity, setIdentity] = useState("");

    useEffect(() => {
        const createToken = async () => {
            try {
                const viewerToken = await createViewerToken(hostIdentity);
                setToken(viewerToken)

                const decodedToken = jwtDecode(viewerToken) as JwtPayload & { name?: string}

                const name = decodedToken?.name;
                const identity = decodedToken.jti;

                if(identity){
                    setIdentity(identity);
                }

                if(name){
                    setName(name)
                }

            } catch {
                toast.error("Something went wrong")
            }
        }

        createToken();
    }, [hostIdentity])

    return {
        token,
        name,
        identity
    }
}