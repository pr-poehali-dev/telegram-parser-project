import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

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
  const [channels, setChannels] = useState(mockChannels);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const { toast } = useToast();

  const filteredChannels = channels.filter(channel => 
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleChannelStatus = (id: number) => {
    setChannels(channels.map(ch => 
      ch.id === id ? { ...ch, active: !ch.active } : ch
    ));
    const channel = channels.find(ch => ch.id === id);
    toast({
      title: channel?.active ? 'Канал остановлен' : 'Канал запущен',
      description: `${channel?.name} ${channel?.active ? 'приостановлен' : 'активирован'}`,
    });
  };

  const addChannel = () => {
    if (!newChannelName.trim()) return;
    
    const newChannel = {
      id: Date.now(),
      name: newChannelName,
      members: 0,
      active: true,
      parsed: 0,
      category: 'Разное'
    };
    
    setChannels([...channels, newChannel]);
    setNewChannelName('');
    setIsAddDialogOpen(false);
    toast({
      title: 'Канал добавлен',
      description: `${newChannelName} успешно добавлен в список`,
    });
  };

  const deleteChannel = (id: number) => {
    const channel = channels.find(ch => ch.id === id);
    setChannels(channels.filter(ch => ch.id !== id));
    toast({
      title: 'Канал удален',
      description: `${channel?.name} удален из списка`,
      variant: 'destructive',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Управление каналами</CardTitle>
              <CardDescription>Добавляйте и настраивайте источники данных</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Icon name="Plus" size={16} />
                  Добавить канал
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Добавить новый канал</DialogTitle>
                  <DialogDescription>
                    Укажите название Telegram канала для мониторинга
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="channel-name">Название канала</Label>
                    <Input 
                      id="channel-name"
                      placeholder="@investchannel" 
                      value={newChannelName}
                      onChange={(e) => setNewChannelName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addChannel()}
                    />
                  </div>
                  <Button onClick={addChannel} className="w-full">
                    Добавить
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
            {filteredChannels.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Каналы не найдены
              </div>
            ) : (
              filteredChannels.map((channel) => (
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
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => toggleChannelStatus(channel.id)}
                    title={channel.active ? 'Остановить' : 'Запустить'}
                  >
                    <Icon name={channel.active ? 'Pause' : 'Play'} size={16} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => deleteChannel(channel.id)}
                    title="Удалить"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            )))}
          
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChannelsTab;