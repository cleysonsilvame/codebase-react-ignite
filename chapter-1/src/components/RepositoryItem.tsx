interface Repository {
  name?: string;
  description: string;
  html_url: string;
}

interface RepositoryItemProps {
  repository: Repository;
}

export function RepositoryItem({ repository }: RepositoryItemProps) {
  return (
    <li>
      <strong>{repository.name ?? "Default"}</strong>
      <p>{repository.description}</p>

      <a href={repository.html_url} target={"_blank"}>
        Acessar repositório
      </a>
    </li>
  );
}
