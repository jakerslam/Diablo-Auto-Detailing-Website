import adapter from '@sveltejs/adapter-static';

const repository = process.env.GITHUB_REPOSITORY || '';
const repositoryName = repository.includes('/') ? repository.split('/')[1] : '';
const basePath = process.env.NODE_ENV === 'production' && repositoryName ? `/${repositoryName}` : '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      fallback: 'index.html'
    }),
    paths: {
      base: basePath
    }
  }
};

export default config;
