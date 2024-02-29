const debounce = function (fn, ms) {
  let timeout;

  return function () {
    let fnCall = () => {
      fn.apply(this, arguments);
    };
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, ms);
  };
};

class View {
  constructor() {
    this.app = document.getElementById('app');

    this.searchLine = this.createElement('div', 'search-line');
    this.searchInput = this.createElement('input', 'search-input');
    this.searchCounter = this.createElement('span', 'counter');
    this.searchLine.append(this.searchInput);

    this.repoWrapper = this.createElement('div', 'repos-wrapper');
    this.reposList = this.createElement('ul', 'repos');
    this.repoWrapper.append(this.reposList);

    this.main = this.createElement('div', 'main');
    this.main.append(this.repoWrapper);

    this.app.append(this.searchLine);
    this.app.append(this.main);

    this.repoCardCount = 0;
  }

  createElement(elementTag, elementClass) {
    const element = document.createElement(elementTag);
    if (elementClass) {
      element.classList.add(elementClass);
    }
    return element;
  }

  createRepo(repoData) {
    const repoElement = this.createElement('li', 'repo');
    repoElement.innerHTML = `<span class="repo-name">${repoData.name}</span> 
    <span class="repo-owner">${repoData.owner.login}</span> 
    <span class="repo-stars">${repoData.stargazers_count}</span>`;

    this.reposList.append(repoElement);
    return repoElement;
  }

  addAndDelRepoCard(repoElement, repoData) {
    if (this.repoCardCount < 3) {
      repoElement.addEventListener('click', () => {
        const repoCard = this.createElement('div', 'repo-card');

        const nameRepo = this.createElement('span', 'repo-card-info');
        nameRepo.textContent = `Name: ${repoData.name}`;
        const ownerRepo = this.createElement('span', 'repo-card-info');
        ownerRepo.textContent = `Owner: ${repoData.owner.login}`;
        const starsRepo = this.createElement('span', 'repo-card-info');
        starsRepo.textContent = `Stars: ${repoData.stargazers_count}`;

        this.app.append(repoCard);
        repoCard.append(nameRepo);
        repoCard.append(ownerRepo);
        repoCard.append(starsRepo);

        const closeButton = this.createElement('button', 'close-button');
        closeButton.textContent = 'X';
        repoCard.append(closeButton);
        closeButton.addEventListener('click', () => {
          this.app.removeChild(repoCard);
          this.repoCardCount--;
        });

        this.searchInput.value = '';
        this.clearRepoList();
        this.repoCardCount++;
      });
    }
  }

  clearRepoList() {
    this.reposList.innerHTML = '';
  }
}

class Search {
  constructor(view) {
    this.view = view;

    this.view.searchInput.addEventListener(
      'keyup',
      debounce(this.loadRepos.bind(this), 500)
    );
  }

  async loadRepos() {
    const searchValue = this.view.searchInput.value;
    if (searchValue) {
      return await fetch(
        `https://api.github.com/search/repositories?q=${searchValue}&per_page=5`
      ).then((res) => {
        if (res.ok) {
          res.json().then((res) => {
            res.items.forEach((rep) => {
              const repoElement = this.view.createRepo(rep);
              this.view.addAndDelRepoCard(repoElement, rep);
            });
            console.log(res);
          });
        } else {
        }
      });
    } else {
      this.view.clearRepoList();
    }
  }
}

new Search(new View());
