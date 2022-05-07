const toggleCinema = () => {
  // find relevent elements for cinema mode
  const mainChild = document.getElementsByTagName('main')[0].children[0];
  const vid = document.getElementsByTagName('video')[0];
  const vidWrapper = vid.parentElement.parentElement.parentElement;

  // add override classes
  vid.classList.toggle('pcm-video-overrides');
  vidWrapper.classList.toggle('pcm-video-container-overrides');
  mainChild.classList.toggle('pcm-main-child-overrides');

  // update local storage flag
  const expanded = vid.classList.contains('pcm-video-overrides');
  chrome.storage.sync.set({ 'pcm-expanded': expanded });
};

const toggleDark = () => {
  // find relevent elements for dark mode
  const body = document.getElementsByTagName('body')[0];
  const mainNav = document.querySelectorAll('[data-tag="navbar"]')[0];
  const mainHeader = mainNav.getElementsByTagName('header')[0];
  const msgSVG = mainNav.querySelectorAll('[title="Messages"]')[0].children[0];

  // add override classes
  body.classList.toggle('pcm-dark-body-override');
  mainHeader.classList.toggle('pcm-dark-header-override');
  msgSVG.classList.toggle('pmc-dark-svg-color');

  // update local storage flag
  const dark = body.classList.contains('pcm-dark-body-override');
  chrome.storage.sync.set({ 'pcm-dark': dark });

  // toggle header onHover handlers
  const addOpacity = () => mainHeader.classList.add('pcm-dark-header-opacity');
  const removeOpacity = () => mainHeader.classList.remove('pcm-dark-header-opacity');
  if (dark) {
    mainHeader.addEventListener('mouseover', addOpacity);
    mainHeader.addEventListener('mouseout', removeOpacity);
  } else {
    mainHeader.removeEventListener('mouseover', addOpacity);
    mainHeader.removeEventListener('mouseout', removeOpacity);
  }
};

const docReady = onReady => {
  // see if DOM is already available
  if (document.readyState === "complete" || document.readyState === "interactive") {
    // call onReady next available tick
    setTimeout(onReady, 1);
  } else {
    // add event listener for on load
    document.addEventListener("DOMContentLoaded", onReady);
  }
};

docReady(() => {
  // check if title element exists on page
  const titleElement = document.querySelectorAll('[data-tag="post-title"]')[0];
  if (titleElement) {
    // create button container
    const container = document.createElement('div');
    container.id = 'pcm-btn-container';
    titleElement.parentElement.append(container);

    // create cinema toggle button
    const expandButton = document.createElement('div');
    expandButton.id = 'pcm-expand-button';
    expandButton.title = 'Toggle cinema mode';
    container.append(expandButton);

    // create dark mode toggle button
    const darkModeButton = document.createElement('div');
    darkModeButton.id = 'pcm-dark-mode-button';
    darkModeButton.title = 'Toggle dark mode';
    container.append(darkModeButton);
    
    // add onClick handlers to buttons
    expandButton.addEventListener('click', toggleCinema);
    darkModeButton.addEventListener('click', toggleDark);
    
    // on load, check pcm flags in local storage and toggle if required
    chrome.storage.sync.get(['pcm-expanded', 'pcm-dark'], store => {
      if (store['pcm-expanded']) {
        toggleCinema();
      }
      if (store['pcm-dark']) {
        toggleDark();
      }
    });
  }
});
