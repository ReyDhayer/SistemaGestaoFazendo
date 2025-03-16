
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  backLink?: string;
  className?: string;
  actions?: React.ReactNode;
}

const PageHeader = ({
  title,
  description,
  backLink,
  className,
  actions
}: PageHeaderProps) => {
  return (
    <div className={cn("mb-8 space-y-3", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col">
          {backLink && (
            <Link 
              to={backLink} 
              className="mb-2 flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Voltar
            </Link>
          )}
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
