import pygame
import random
import math

bg_color = [25,25,25]

# PYGAME SETUP
pygame.init()
pygame.font.init()
font_size = 75
font = pygame.font.SysFont("comicsans", font_size)

w = 600
h = 600
CENTER_WIDTH = w/2
CENTER_HEIGHT = h/2

win = pygame.display.set_mode((w, h))

# END PYGAME SETUP

class Circle:
    def __init__(self, parent, radius, speed, direction, first=False, x=0, y=0):
        if first:
            self.parent = None
            self.x = x
            self.y = y
        else:
            self.parent = parent
            self.x = parent.x + parent.radius
            self.y = parent.y
        self.radius = radius
        self.speed = speed
        self.direction = direction
        self.theta = 0
    

    def draw(self, win):
        if self.parent:
            pygame.draw.circle(win, (255, 255, 255), (int(self.x), int(self.y)), int(self.radius), 1)


    def update(self):
        if self.parent:
            self.x = self.parent.x + math.cos(self.theta * self.direction) * self.parent.radius
            self.y = self.parent.y + math.sin(self.theta * self.direction) * self.parent.radius
        self.theta += (self.speed/10)/(2*math.pi)
        


def clear():
    win.fill(bg_color)

def gen():
    circles = [[], []]
    speed_scale = 0.005

    for i in range(0, 2):
        if i == 0:
            circles[i].append(Circle(None, 0, 0, 1, first=True, x=200, y=h - 200))
        else:
            circles[i].append(Circle(None, 0, 0, 1, first=True, x=w - 200, y=200))
        for j in range(0, random.randint(1, 10)):
            radius = random.randint(5, 50)
            speed = random.randint(5, 100)
            direction = random.choice([-1, 1])
            circles[i].append(Circle(circles[i][j], radius, speed * speed_scale, direction))
            # print("GROUP {} #{}: radius={}, speed={}, direction={}".format(i, j, radius, speed, direction))
    return circles, speed_scale


def main():
    size = 1
    scale = 2
    draw_lines = True

    clock = pygame.time.Clock()
    tickspeed = 100


    #circles, speed_scale = gen()

    # MANUALLY ENTER CIRCLES LIKE THIS:
    # circles[group_num].aooend(Circle(PARENT CIRCLE, RADIUS, SPEED * speed_scale, DIRECTION(1=clockwise, -1=counterclockwise)))
    circles = [[], []]
    speed_scale = 0.05 #this effects the speed
    
    group_num = 0
    circles[group_num].append(Circle(None, 100, 10, 1, first=True, x=150, y=h - 150))
    circles[group_num].append(Circle(circles[group_num][-1], 60, 10 * speed_scale, 1))
    circles[group_num].append(Circle(circles[group_num][-1], 30, 20 * speed_scale, -1))


    group_num = 1

    circles[group_num].append(Circle(None, 5, 10, 1, first=True, x=w - 150, y=150))
    circles[group_num].append(Circle(circles[group_num][-1], 30, 30 * speed_scale, -1))
    circles[group_num].append(Circle(circles[group_num][-1], 50, 40 * speed_scale, 1))

    x = circles[0][-1].x
    x1 = circles[1][-1].x


    point_width = 1
    points = []

    # MAIN LOOP
    run = True
    gen_coords = True
    draw_coords = True
    draw_circles = True
    coord_multiplier = 0
    coord_mult = 0.25
    while run:
        clock.tick(tickspeed)
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                run = False
                pygame.quit()
                quit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    draw_circles = not draw_circles
                if event.key == pygame.K_UP:
                    coord_multiplier = 0.99
                if event.key == pygame.K_DOWN:
                    coord_multiplier = 1.01
                if event.key == pygame.K_l:
                    draw_lines = not draw_lines
                if event.key == pygame.K_ESCAPE:
                    run = False
                    pygame.quit()
                    quit()
                if event.key == pygame.K_r:
                    clear()
                    points = []
                    circles, speed_scale = gen()
                    gen_coords = True
                    draw_coords = True
            if event.type == pygame.KEYUP:
                if event.key == pygame.K_UP or event.key == pygame.K_DOWN:
                    coord_multiplier = 0
        if gen_coords:
            for circle_group in circles:
                 for circle in circle_group:
                    circle.update()
                    if draw_circles:
                        circle.draw(win)
            point = [circles[1][-1].x - CENTER_WIDTH + 200, circles[0][-1].y - CENTER_HEIGHT + 200]
            if point not in points:
                points.append(point)
            if x - 2< int(circles[0][-1].x) < x + 2 and x1 - 2 < int(circles[1][-1].x) < x1 + 2 and len(points) > 5/speed_scale:
                gen_coords = False
                draw_lines = False
                draw_circles = True
                clock.tick(0.25)
            
            for point in points[1::int(coord_mult/speed_scale)]:
                rect = pygame.Rect(point[0], point[1], point_width, point_width)
                pygame.draw.rect(win, (255, 255, 255), rect)

            if draw_lines:
                pygame.draw.line(win, (255, 0, 0), (circles[0][-1].x, circles[0][-1].y), (circles[1][-1].x - CENTER_WIDTH + 200, circles[0][-1].y - CENTER_HEIGHT + 200))
                pygame.draw.line(win, (255, 255, 0), (circles[1][-1].x, circles[1][-1].y), (circles[1][-1].x - CENTER_WIDTH + 200, circles[0][-1].y - CENTER_HEIGHT + 200))
            pygame.display.update()
            clear()
        else:
            for point in points:
                rect = pygame.Rect(point[0], point[1], point_width, point_width)
                pygame.draw.rect(win, (255, 255, 255), rect)
            pygame.display.update()
            clear()
        if coord_multiplier:
            coord_mult *= coord_multiplier
                
        
        

main()