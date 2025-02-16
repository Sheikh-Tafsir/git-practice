import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { addRequestParam } from "@/utils/utils";
  
export function PaginationButton({page, totalPages, link}) {

    const showButton = (i) => {
        return i == 1 || i == page-1 ||  i == page+1 || i == totalPages;
    }

    return (
      <Pagination className="mt-4">
        <PaginationContent>
            <PaginationItem>
                <PaginationPrevious href={addRequestParam(link, "page", Math.max(page-1,1))} />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((i) => {
                if (i === totalPages && page + 1 < totalPages - 1) {
                    return (
                        <PaginationItem key={`ellipsis-end-${i}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    );
                }
                if(i == page) {
                    return (
                        <PaginationItem key={`active-${i}`}>
                            <PaginationLink href={addRequestParam(link, "page", i)} isActive>
                                {i}
                            </PaginationLink>
                        </PaginationItem>
                    );
                } else if(showButton(i)) {
                    return (
                        <PaginationItem key={`page-${i}`}>
                            <PaginationLink href={addRequestParam(link, "page", i)}>{i}</PaginationLink>
                        </PaginationItem>
                    )
                }

                if (i === 1 && page - 1 > 2) {
                    return (
                        <PaginationItem key={`ellipsis-start-${i}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    );
                }
            })}
            <PaginationItem>
                <PaginationNext href={addRequestParam(link, "page", Math.min(parseInt(page) +1, totalPages))} />
            </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
}
  