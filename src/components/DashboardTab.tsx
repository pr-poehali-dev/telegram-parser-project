import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Signal {
  id: number;
  ticker: string;
  signal_type: string;
  entry_price: number;
  target_price: number;
  stop_loss: number;
  channel_username: string;
  message_text: string;
  created_at: string;
}

interface DashboardTabProps {
  activityData: Array<{ date: string; cases: number }>;
  categoryData: Array<{ name: string; value: number; color: string }>;
  mockCases: any[];
}

const API_URL = 'https://functions.poehali.dev/3fb95351-9d0d-462f-9b12-5c4709f76f2e';

const DashboardTab = ({ activityData, categoryData }: DashboardTabProps) => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSignals();
  }, []);

  const loadSignals = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setSignals(data.signals || []);
    } catch (error) {
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить сигналы',
        variant: 'destructive',
      });
    }
  };

  const deleteSignal = async (id: number) => {
    try {
      await fetch(API_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      toast({ title: 'Удалено', description: 'Сигнал удален' });
      loadSignals();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего каналов</CardTitle>
            <Icon name="Radio" className="text-muted-foreground" size={16} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{signals.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Всего сигналов</p>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Собрано кейсов</CardTitle>
            <Icon name="FileText" className="text-muted-foreground" size={16} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3,205</div>
            <p className="text-xs text-muted-foreground mt-1">+412 сегодня</p>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активных парсеров</CardTitle>
            <Icon name="Activity" className="text-muted-foreground" size={16} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18</div>
            <p className="text-xs text-muted-foreground mt-1">75% активности</p>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ср. доходность</CardTitle>
            <Icon name="TrendingUp" className="text-muted-foreground" size={16} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">28.5%</div>
            <p className="text-xs text-muted-foreground mt-1">По всем кейсам</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Активность парсинга</CardTitle>
            <CardDescription>Собранные кейсы за последнюю неделю</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1f2c', border: '1px solid #333' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="cases" stroke="#9b87f5" strokeWidth={3} dot={{ fill: '#9b87f5', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Категории инвестиций</CardTitle>
            <CardDescription>Распределение по типам кейсов</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1f2c', border: '1px solid #333' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Последние сигналы</CardTitle>
          <CardDescription>Новые инвестиционные сигналы из Telegram</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {signals.slice(0, 5).map((signal) => (
              <div key={signal.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name="TrendingUp" className="text-primary" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{signal.ticker || 'N/A'}</h4>
                      <Badge 
                        variant={signal.signal_type === 'BUY' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {signal.signal_type || 'SIGNAL'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">@{signal.channel_username} • {new Date(signal.created_at).toLocaleDateString('ru-RU')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-500">${signal.entry_price || 'N/A'}</div>
                    <div className="text-xs text-muted-foreground">Вход</div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setSelectedSignal(signal)}
                    title="Подробнее"
                  >
                    <Icon name="ExternalLink" size={16} />
                  </Button>
                </div>
              </div>
            ))}
            {signals.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="Inbox" size={48} className="mx-auto mb-2 opacity-50" />
                <p>Пока нет сигналов</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedSignal} onOpenChange={() => setSelectedSignal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedSignal?.ticker || 'Сигнал'}
              <Badge variant={selectedSignal?.signal_type === 'BUY' ? 'default' : 'destructive'}>
                {selectedSignal?.signal_type}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              @{selectedSignal?.channel_username} • {selectedSignal && new Date(selectedSignal.created_at).toLocaleDateString('ru-RU')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Вход</div>
                <div className="text-xl font-bold text-blue-500">${selectedSignal?.entry_price || 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Цель</div>
                <div className="text-xl font-bold text-green-500">${selectedSignal?.target_price || 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Стоп</div>
                <div className="text-xl font-bold text-red-500">${selectedSignal?.stop_loss || 'N/A'}</div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-accent/50">
              <p className="text-sm whitespace-pre-wrap">{selectedSignal?.message_text}</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="destructive" 
                className="flex-1 gap-2"
                onClick={() => {
                  if (selectedSignal) {
                    deleteSignal(selectedSignal.id);
                    setSelectedSignal(null);
                  }
                }}
              >
                <Icon name="Trash2" size={16} />
                Удалить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardTab;