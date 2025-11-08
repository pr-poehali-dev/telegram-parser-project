import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const API_URL = 'https://functions.poehali.dev/435acf72-02c8-4ca3-88af-4cc09b5d3c4e';

const ParsingTab = () => {
  const [keywords, setKeywords] = useState('');
  const [minROI, setMinROI] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedCount, setParsedCount] = useState(0);
  const [schedules, setSchedules] = useState([
    { id: 1, name: 'Каждые 2 часа', description: 'Основные каналы', active: true },
    { id: 2, name: 'Раз в день (09:00)', description: 'VIP каналы', active: false },
  ]);
  const { toast } = useToast();

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const startParsing = async () => {
    setIsParsing(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      
      if (data.status === 'success') {
        setParsedCount(data.parsed_messages || 0);
        toast({
          title: 'Парсинг завершен',
          description: `Обработано сообщений: ${data.parsed_messages}`,
        });
      } else {
        toast({
          title: 'Ошибка парсинга',
          description: data.message || 'Не удалось запустить парсинг',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось подключиться к парсеру',
        variant: 'destructive',
      });
    } finally {
      setIsParsing(false);
    }
  };

  const applyFilters = () => {
    toast({
      title: 'Фильтры применены',
      description: `Ключевые слова: ${keywords || 'не указаны'}, Категории: ${selectedCategories.length || 'все'}`,
    });
  };

  const toggleSchedule = (id: number) => {
    setSchedules(schedules.map(s => 
      s.id === id ? { ...s, active: !s.active } : s
    ));
    const schedule = schedules.find(s => s.id === id);
    toast({
      title: schedule?.active ? 'Расписание остановлено' : 'Расписание запущено',
      description: schedule?.name,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Фильтры парсинга</CardTitle>
            <CardDescription>Настройте автоматический сбор данных</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ключевые слова</label>
              <Input 
                placeholder="инвестиции, ROI, доходность..."
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Категории</label>
              <div className="flex flex-wrap gap-2">
                {['Акции', 'Крипто', 'Недвижимость', 'Стартапы', 'Облигации'].map((cat) => (
                  <Badge 
                    key={cat} 
                    variant={selectedCategories.includes(cat) ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-primary/20"
                    onClick={() => toggleCategory(cat)}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Минимальная доходность (%)</label>
              <Input 
                type="number" 
                placeholder="10"
                value={minROI}
                onChange={(e) => setMinROI(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Button className="w-full" onClick={applyFilters}>Применить фильтры</Button>
              <Button className="w-full" onClick={startParsing} disabled={isParsing} variant="secondary">
                <Icon name="RefreshCw" size={16} className={isParsing ? 'animate-spin' : ''} />
                {isParsing ? 'Парсинг...' : 'Запустить парсинг'}
              </Button>
              {parsedCount > 0 && (
                <p className="text-sm text-muted-foreground text-center">Обработано: {parsedCount} сообщений</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Расписание парсинга</CardTitle>
            <CardDescription>Автоматический сбор по времени</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {schedules.map((schedule) => (
                <div 
                  key={schedule.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border cursor-pointer hover:bg-accent/50"
                  onClick={() => toggleSchedule(schedule.id)}
                >
                  <div className="flex items-center gap-3">
                    <Icon 
                      name="Clock" 
                      className={schedule.active ? 'text-primary' : 'text-muted-foreground'} 
                      size={20} 
                    />
                    <div>
                      <div className="font-medium">{schedule.name}</div>
                      <div className="text-xs text-muted-foreground">{schedule.description}</div>
                    </div>
                  </div>
                  <Badge variant={schedule.active ? 'default' : 'secondary'}>
                    {schedule.active ? 'Активно' : 'Остановлено'}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full gap-2">
              <Icon name="Plus" size={16} />
              Добавить расписание
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Текущий прогресс парсинга</CardTitle>
          <CardDescription>Сбор данных в реальном времени</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Инвестиции России</span>
              <span className="text-muted-foreground">87%</span>
            </div>
            <Progress value={87} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Crypto Invest Pro</span>
              <span className="text-muted-foreground">62%</span>
            </div>
            <Progress value={62} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Стартап Инвестиции</span>
              <span className="text-muted-foreground">34%</span>
            </div>
            <Progress value={34} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParsingTab;