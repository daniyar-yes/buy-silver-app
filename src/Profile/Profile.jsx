import style from './Profile.module.css';

const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://react.dev/images/docs/scientists/yXOvdOSs.jpg',

};

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className={style.avatar}
        src={user.imageUrl}
        alt={'Photo of ' + user.name}
      />
    </>
  );
}
