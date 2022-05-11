import { RepositoryItem } from "./RepositoryItem";

export function RepositoryList() {
  return (
    <section className="repository-list">
      <h1>Lista de repositórios</h1>
      <ul>
        <RepositoryItem repository={{
          name: 'React',
          description: 'Framework JavaScript',
          link: 'http://github.com/facebook/react'
        }}/>
      </ul>
    </section>
  );
}
