import { redirect } from "next/navigation";
import { Results, ResultsSkeleton } from "./_components/results";
import { Suspense } from "react";

// ye ek server component h toh hum directly parameter me se params ko access kr skte h.
interface SearchPageProps {
    searchParams: {
        term ?: string;
    }
}

const SearchPage = ({
    searchParams
}: SearchPageProps) => {

    // yadi url me search k baad query me term nhi hogi toh hum ushe home page pr redirect krdege.
    if(!searchParams.term){
        redirect("/")
    }

    return (
        <div className="h-full p-8 max-w-screen-2xl mx-auto">
            <Suspense fallback={<ResultsSkeleton />}>
                <Results term={searchParams.term} />
            </Suspense>
        </div>
    )
}

export default SearchPage;