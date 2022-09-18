import pygame
import math

bg_color = [25,25,25]

# PYGAME SETUP
pygame.init()
pygame.font.init()
font1 = pygame.font.SysFont("comicsans", 35)
font2 = pygame.font.SysFont("comicsans", 25)

w = 600
h = 670
CENTER_WIDTH = w/2
CENTER_HEIGHT = (h+70)/2

win = pygame.display.set_mode((w, h))

# END PYGAME SETUP

def clear():
    win.fill(bg_color)


def draw_polar_coord(r, t, color, size, scale, last_x, last_y):
    x = r * math.cos(t) * scale
    y = r * math.sin(t) * scale

    rect = pygame.Rect(CENTER_WIDTH + x, CENTER_HEIGHT + y, size, size)
    pygame.draw.rect(win, color, rect)
    # pygame.draw.line(win, color, (CENTER_WIDTH + last_x, CENTER_HEIGHT + last_y), (CENTER_WIDTH + x, CENTER_HEIGHT + y))

    return x, y


def gen_numbers(start, end, n):
    x = []
    y = []
    for i in range(start, end):
        y.append(i)
        x.append(math.sin(i*n))

    return x, y


def main():
    clock = pygame.time.Clock()
    tickspeed = 100
    clear()

    n = 0
    # MAIN LOOP
    run = True
    while run:
        clock.tick(tickspeed)
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                run = False
                pygame.quit()
                quit()

        x, y = gen_numbers(1, 10000, n)
        last_x, last_y = 0, 0
        for i in range(0, len(x)-1):
            startx, starty = draw_polar_coord(x[i], y[i], [255,255,255], 0.5, 290, last_x, last_y)

        n += 0.00001
        n = round(n, 10)

        text = font1.render("y = sin(nx)", 1, (100,150,220))
        text_width = text.get_width()
        text_height = text.get_height()
        win.blit(text, (CENTER_WIDTH - text_width/2,  10))

        text = font2.render("n = " + str(n), 1, (100,150,220))
        text_width = text.get_width()
        win.blit(text, (CENTER_WIDTH - text_width/2,  10 + text_height))

        pygame.display.update()
        clear()


main()
