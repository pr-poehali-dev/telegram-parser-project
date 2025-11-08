import { useState, useEffect } from 'react';
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
  channel_username: string;
  channel_title: string;
  is_active: boolean;
  last_message_id: number;
}

interface ChannelsTabProps {
  mockChannels?: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const API_URL = 'https://functions.poehali.dev/3fb95351-9d0d-462f-9b12-5c4709f76f2e';

const ChannelsTab = ({ searchQuery, setSearchQuery }: ChannelsTabProps) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setChannels(data.channels || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить каналы',
        variant: 'destructive',
      });
    }
  };

  const filteredChannels = channels.filter(channel => 
    channel.channel_username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.channel_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleChannelStatus = (id: number) => {
    setChannels(channels.map(ch => 
      ch.id === id ? { ...ch, is_active: !ch.is_active } : ch
    ));
    const channel = channels.find(ch => ch.id === id);
    toast({
      title: channel?.is_active ? 'Канал остановлен' : 'Канал запущен',
      description: `@${channel?.channel_username} ${channel?.is_active ? 'приостановлен' : 'активирован'}`,
    });
  };

  const addChannel = async () => {
    if (!newChannelName.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel_username: newChannelName.replace('@', ''),
          channel_title: newChannelName.replace('@', ''),
        }),
      });
      
      if (res.ok) {
        toast({
          title: 'Канал добавлен',
          description: `@${newChannelName} успешно добавлен`,
        });
        setNewChannelName('');
        setIsAddDialogOpen(false);
        loadChannels();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить канал',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteChannel = (id: number) => {
    const channel = channels.find(ch => ch.id === id);
    setChannels(channels.filter(ch => ch.id !== id));
    toast({
      title: 'Канал удален',
      description: `@${channel?.channel_username} удален из списка`,
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
                  <Button onClick={addChannel} className="w-full" disabled={loading}>
                    {loading ? 'Добавление...' : 'Добавить'}
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
                    {channel.channel_username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">@{channel.channel_username}</h4>
                      <Badge variant={channel.is_active ? 'default' : 'secondary'}>
                        {channel.is_active ? 'Активен' : 'Остановлен'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {channel.channel_title}
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
                    <Icon name={channel.is_active ? 'Pause' : 'Play'} size={16} />
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