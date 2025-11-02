import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface Channel {
  id: number;
  name: string;
  members: number;
  active: boolean;
  parsed: number;
  category: string;
}

interface ChannelsTabProps {
  mockChannels: Channel[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ChannelsTab = ({ mockChannels, searchQuery, setSearchQuery }: ChannelsTabProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Управление каналами</CardTitle>
              <CardDescription>Добавляйте и настраивайте источники данных</CardDescription>
            </div>
            <Button className="gap-2">
              <Icon name="Plus" size={16} />
              Добавить канал
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input 
              placeholder="Поиск каналов..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="space-y-3">
            {mockChannels.map((channel) => (
              <div key={channel.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                    {channel.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{channel.name}</h4>
                      <Badge variant={channel.active ? 'default' : 'secondary'}>
                        {channel.active ? 'Активен' : 'Остановлен'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {channel.members.toLocaleString()} подписчиков • {channel.parsed} кейсов • {channel.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost">
                    <Icon name="Settings" size={16} />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Icon name="MoreVertical" size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChannelsTab;
