import { Button } from '@/components/ui/button'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ currentPage, totalPages, onPageChange, className = '' }: PaginationProps) {
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }
    
    return pages
  }

  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="text-gray-500 hover:text-black dark:hover:text-white"
      >
        <LuChevronLeft className="h-4 w-4" />
      </Button>
      
      {getVisiblePages().map((page, index) => (
        <div key={index}>
          {page === '...' ? (
            <span className="px-2 text-gray-400">...</span>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(page as number)}
              className={`w-8 h-8 p-0 ${
                currentPage === page
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'text-gray-500 hover:text-black dark:hover:text-white'
              }`}
            >
              {page}
            </Button>
          )}
        </div>
      ))}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="text-gray-500 hover:text-black dark:hover:text-white"
      >
        <LuChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}