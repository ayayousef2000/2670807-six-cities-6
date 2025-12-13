import { Link } from 'react-router-dom';
import { AppRoute } from '../../app/routes';
import styles from './not-found-page.module.css';
function NotFoundPage(): JSX.Element {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404 Page Not Found</h1>

      <img
        className={styles.image}
        src="/img/404.gif"
        alt="Animated graphic indicating a page is not found"
        width="600"
      />

      <p className={styles.text}>
        <Link to={AppRoute.Main} className={styles.link}>
          Go back to the main page
        </Link>
      </p>
    </div>
  );
}

export default NotFoundPage;
