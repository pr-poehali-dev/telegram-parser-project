import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

const ParsingTab = () => {
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
              <Input placeholder="инвестиции, ROI, доходность..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Категории</label>
              <div className="flex flex-wrap gap-2">
                {['Акции', 'Крипто', 'Недвижимость', 'Стартапы', 'Облигации'].map((cat) => (
                  <Badge key={cat} variant="outline" className="cursor-pointer hover:bg-primary/20">
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Минимальная доходность (%)</label>
              <Input type="number" placeholder="10" />
            </div>
            <Button className="w-full">Применить фильтры</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Расписание парсинга</CardTitle>
            <CardDescription>Автоматический сбор по времени</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Icon name="Clock" className="text-primary" size={20} />
                  <div>
                    <div className="font-medium">Каждые 2 часа</div>
                    <div className="text-xs text-muted-foreground">Основные каналы</div>
                  </div>
                </div>
                <Badge variant="default">Активно</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Icon name="Clock" className="text-muted-foreground" size={20} />
                  <div>
                    <div className="font-medium">Раз в день (09:00)</div>
                    <div className="text-xs text-muted-foreground">VIP каналы</div>
                  </div>
                </div>
                <Badge variant="secondary">Остановлено</Badge>
              </div>
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
