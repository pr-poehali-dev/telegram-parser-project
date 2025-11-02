import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const Header = () => {
  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="Radio" className="text-primary" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">TG Parser</h1>
              <p className="text-xs text-muted-foreground">Мониторинг инвестиционных каналов</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Онлайн
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
