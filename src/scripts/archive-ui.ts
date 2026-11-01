const themeStorageKey = 'se-theme';

type ThemeChoice = 'system' | 'light' | 'dark';

function applyTheme(choice: ThemeChoice): void {
  if (choice === 'system') {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = choice;
  }
}

function storedTheme(): ThemeChoice {
  try {
    const value = window.localStorage.getItem(themeStorageKey);
    return value === 'light' || value === 'dark' ? value : 'system';
  } catch {
    return 'system';
  }
}

function setStoredTheme(choice: ThemeChoice): void {
  try {
    if (choice === 'system') {
      window.localStorage.removeItem(themeStorageKey);
    } else {
      window.localStorage.setItem(themeStorageKey, choice);
    }
  } catch {
    // Storage is optional; the active theme still applies for this page.
  }
}

function initializeThemeControl(): void {
  const select = document.querySelector<HTMLSelectElement>('[data-theme-select]');
  if (!select) return;

  const choice = storedTheme();
  applyTheme(choice);
  select.value = choice;
  select.addEventListener('change', () => {
    const next = select.value === 'light' || select.value === 'dark' ? select.value : 'system';
    applyTheme(next);
    setStoredTheme(next);
  });
}

function initializeCopyTools(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-copy-target]').forEach((button) => {
    const targetId = button.dataset.copyTarget;
    const statusId = button.dataset.copyStatus;
    const target = targetId ? document.getElementById(targetId) : null;
    const status = statusId ? document.getElementById(statusId) : null;
    if (!target || !status) return;

    button.addEventListener('click', async () => {
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard access is unavailable');
        await navigator.clipboard.writeText(target.textContent?.trim() ?? '');
        status.textContent = 'Copied to your clipboard.';
      } catch {
        status.textContent = 'Could not copy. Select the text above and copy it manually.';
      }
    });
  });
}

function initializeToc(): void {
  document.querySelectorAll<HTMLElement>('[data-toc]').forEach((toc) => {
    const links = [...toc.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
    const sections = links
      .map((link) => document.getElementById(link.getAttribute('href')?.slice(1) ?? ''))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length || !('IntersectionObserver' in window)) return;

    const setCurrent = (id: string): void => {
      links.forEach((link) => {
        if (link.getAttribute('href') === `#${id}`) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };

    const updateCurrent = (): void => {
      const guide = window.innerHeight * 0.3;
      let current = sections[0];
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= guide) current = section;
      });
      setCurrent(current.id);
    };

    updateCurrent();

    const observer = new IntersectionObserver(
      () => updateCurrent(),
      { rootMargin: '-20% 0px -65% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    window.addEventListener('scroll', updateCurrent, { passive: true });
    window.addEventListener('resize', updateCurrent);
  });
}

initializeThemeControl();
initializeCopyTools();
initializeToc();
