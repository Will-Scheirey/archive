import pygame




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

def clear():
    win.fill(bg_color)


def main():
    clock = pygame.time.Clock()
    tickspeed = 20

    win.fill(bg_color)

    text = font.render("Hello, World!", 1, (255,255,255))
    text_width = text.get_width()
    text_height = text.get_height()
    win.blit(text, (CENTER_WIDTH - text_width/2,  CENTER_HEIGHT - text_height/2))

    # MAIN LOOP
    run = True
    while run:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                run = False
                pygame.quit()
                quit()
        clock.tick(tickspeed)
        pygame.display.update()

main()
