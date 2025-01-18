import { useForm } from 'react-hook-form';
import Input from '../../ui/input';
import Button from '../../ui/button';
import { Link } from 'react-router-dom';
import lockPass from '../../assets/icons/lock_pass.svg';

interface IAccountRecovery {
  emailOrUsername: string;
}

const ResetPass = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAccountRecovery>();

  const onSubmit = (data: IAccountRecovery) => {
    console.log('Login data:', data);
  };

  // Регулярное выражение для проверки email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return (
    <div className="w-[350px] max-h-[412px] bg-white border border-gray-300 flex flex-col items-center">
      <img src={lockPass} alt="Logo" className="w-24 mt-6 mb-8" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full px-10"
      >
        <Input
          type="text"
          placeholder="Username or Email"
          className="mb-2"
          variant="primary"
          autoComplete="username"
          {...register('emailOrUsername', {
            required: 'This field is required',
            minLength: { value: 3, message: 'Must be at least 3 characters' },
            validate: (value) =>
              emailRegex.test(value) ? true : 'Invalid email format',
          })}
        />
        {errors.emailOrUsername && (
          <span className="mb-2 text-xs text-red-500">
            {errors.emailOrUsername.message}
          </span>
        )}

        {/* Кнопка входа */}
        <Button type="submit" variant="primary" className="w-full mt-2">
          Reset your password
        </Button>
      </form>

      {/* Разделитель OR */}
      <div className="flex items-center w-full px-10 my-3">
        <div className="flex-grow h-px bg-gray-300"></div>
        <span className="mx-3 text-sm text-gray-500">OR</span>
        <div className="flex-grow h-px bg-gray-300"></div>
      </div>

      {/* Ссылка на восстановление пароля */}
      <Link to="/signup" className="text-sm text-blue-500 ">
        Create new account
      </Link>

      {/* Блок регистрации */}
      <div className="w-full py-4 mt-4 text-center border-t">
        <Link to="/login" className="font-semibold text-blue-500">
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default ResetPass;
