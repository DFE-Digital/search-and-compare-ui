using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Query.Internal;
using MockQueryable;
using Moq;
using NUnit.Framework;

namespace GovUk.Education.SearchAndCompare.UI.Unit.Tests
{
	public class MockedIQueryable<TEntity> where TEntity : class
	{
        public Mock<IQueryable<TEntity>> Mock { get; private set; }

		public IQueryable<TEntity> Object { get { return Mock.Object; } }

		private TestAsyncEnumerableExtended<TEntity> TestAsyncEnumerableExtended { get; set; }

        public MockedIQueryable(IQueryable<TEntity> data)
        {
			Mock = new Mock<IQueryable<TEntity>>();
			TestAsyncEnumerableExtended = new TestAsyncEnumerableExtended<TEntity>(data);
			Mock.As<IAsyncEnumerable<TEntity>>().Setup(d => d.GetEnumerator()).Returns(TestAsyncEnumerableExtended.GetEnumerator);
			Mock.As<IQueryable<TEntity>>().Setup(m => m.Provider).Returns(TestAsyncEnumerableExtended);
			Mock.As<IQueryable<TEntity>>().Setup(m => m.Expression).Returns(data.Expression);
			Mock.As<IQueryable<TEntity>>().Setup(m => m.ElementType).Returns(data.ElementType);
			Mock.As<IQueryable<TEntity>>().Setup(m => m.GetEnumerator()).Returns(data.GetEnumerator());
        }

		public void AddCreateQueryShim(Action<Expression> shim)
		{
			TestAsyncEnumerableExtended.CreateQueryShims.Add(shim);
		}
	}
	public static class MoqExtensionsExtended
	{
		public static MockedIQueryable<TEntity> BuildMockExtended<TEntity>(
			this IQueryable<TEntity> data) where TEntity : class
		{
			return new MockedIQueryable<TEntity>(data);
		}
	}

	public class TestAsyncEnumerableExtended<T> : IAsyncEnumerable<T>, IOrderedQueryable<T>, IAsyncQueryProvider
	{
		private IEnumerable<T> _enumerable;

		public TestAsyncEnumerableExtended(Expression expression)
		{
			Expression = expression;
		}

		public TestAsyncEnumerableExtended(IEnumerable<T> enumerable)
		{
			_enumerable = enumerable;
		}

		public IAsyncEnumerator<T> GetEnumerator()
		{
			return new TestAsyncEnumerator<T>(this.AsEnumerable().GetEnumerator());
		}

		public List<Action<Expression>> CreateQueryShims = new List<Action<Expression>>();

		public IQueryable CreateQuery(Expression expression)
		{
			foreach (var shim in CreateQueryShims)
			{
				shim(expression);
			}
			return new TestAsyncEnumerable<T>(expression);
		}

		public IQueryable<TEntity> CreateQuery<TEntity>(Expression expression)
		{
			foreach (var shim in CreateQueryShims)
			{
				shim(expression);
			}
			return new TestAsyncEnumerable<TEntity>(expression);
		}

		public object Execute(Expression expression)
		{
			return CompileExpressionItem<object>(expression);
		}

		public TResult Execute<TResult>(Expression expression)
		{
			return CompileExpressionItem<TResult>(expression);
		}

		public IAsyncEnumerable<TResult> ExecuteAsync<TResult>(Expression expression)
		{
			return new TestAsyncEnumerable<TResult>(expression);
		}

		public Task<TResult> ExecuteAsync<TResult>(Expression expression, CancellationToken cancellationToken)
		{
			return Task.FromResult(CompileExpressionItem<TResult>(expression));
		}


		IEnumerator<T> IEnumerable<T>.GetEnumerator()
		{
			if (_enumerable == null) _enumerable = CompileExpressionItem<IEnumerable<T>>(Expression);
			return _enumerable.GetEnumerator();
		}

		IEnumerator IEnumerable.GetEnumerator()
		{
			if (_enumerable == null) _enumerable = CompileExpressionItem<IEnumerable<T>>(Expression);
			return _enumerable.GetEnumerator();
		}

		public Type ElementType => typeof(T);

		public Expression Expression { get; }

		public IQueryProvider Provider => this;

		private static TResult CompileExpressionItem<TResult>(Expression expression)
		{
			var rewriter = new TestExpressionVisitor();
			var body = rewriter.Visit(expression);
			var f = Expression.Lambda<Func<TResult>>(body, (IEnumerable<ParameterExpression>) null);
			return f.Compile()();
		}
	}
}