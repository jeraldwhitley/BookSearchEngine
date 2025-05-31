import User from '../models/User.js';
import { signToken } from '../services/auth.js';

export const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      return await User.findById(context.user._id);
    },
  },
  Mutation: {
    login: async (_: any, { email, password }: any) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new Error('Invalid credentials');
      }
      const token = signToken(user.username, user.email, user._id);

      return { token, user };
    },
    addUser: async (_: any, args: any) => {
      const user = await User.create(args);
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    saveBook: async (_: any, { input }: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      return await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: input } },
        { new: true }
      );
    },
    removeBook: async (_: any, { bookId }: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      return await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
    },
  },
};
